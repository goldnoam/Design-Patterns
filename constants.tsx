
import { DesignPattern, PatternCategory } from './types';

export const DESIGN_PATTERNS: DesignPattern[] = [
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    category: PatternCategory.CREATIONAL,
    description: 'Lets you produce families of related objects without specifying their concrete classes.',
    whenToUse: [
      'When your code needs to work with various families of related products.',
      'When you want to provide a library of products and you want to expose only their interfaces, not their implementations.'
    ],
    pros: [
      'Compatibility between products is guaranteed.',
      'Avoids tight coupling between concrete products and client code.',
      'Supports Open/Closed Principle.'
    ],
    cons: [
      'Code may become more complicated due to many new interfaces and classes.'
    ],
    codeExample: `#include <iostream>
#include <string>
#include <memory>

// Abstract Products
class AbstractProductA {
public:
    virtual ~AbstractProductA() = default;
    virtual std::string UsefulFunctionA() const = 0;
};

class AbstractProductB {
public:
    virtual ~AbstractProductB() = default;
    virtual std::string UsefulFunctionB() const = 0;
};

// Concrete Products Family 1
class ConcreteProductA1 : public AbstractProductA {
public:
    std::string UsefulFunctionA() const override {
        return "Result of Product A1.";
    }
};

class ConcreteProductB1 : public AbstractProductB {
public:
    std::string UsefulFunctionB() const override {
        return "Result of Product B1.";
    }
};

// Abstract Factory Interface
class AbstractFactory {
public:
    virtual std::unique_ptr<AbstractProductA> CreateProductA() const = 0;
    virtual std::unique_ptr<AbstractProductB> CreateProductB() const = 0;
    virtual ~AbstractFactory() = default;
};

// Concrete Factory 1
class ConcreteFactory1 : public AbstractFactory {
public:
    std::unique_ptr<AbstractProductA> CreateProductA() const override {
        return std::make_unique<ConcreteProductA1>();
    }
    std::unique_ptr<AbstractProductB> CreateProductB() const override {
        return std::make_unique<ConcreteProductB1>();
    }
};

// Client code demonstrating pattern usage
void ClientCode(const AbstractFactory& factory) {
    auto productA = factory.CreateProductA();
    auto productB = factory.CreateProductB();
    std::cout << "Client: " << productA->UsefulFunctionA() << std::endl;
    std::cout << "Client: " << productB->UsefulFunctionB() << std::endl;
}

int main() {
    std::cout << "Testing client code with the first factory type:\\n";
    ConcreteFactory1 factory1;
    ClientCode(factory1);
    
    return 0;
}`
  },
  {
    id: 'singleton',
    name: 'Singleton',
    category: PatternCategory.CREATIONAL,
    description: 'Ensures a class has only one instance and provides a global point of access to it.',
    whenToUse: [
      'When you need exactly one instance of a class (e.g., Database connection, Logger).',
      'When you need to provide a global access point to that instance.'
    ],
    pros: [
      'Strict control over instance creation.',
      'Memory saving by reusing the same instance.',
      'Delayed initialization (lazy loading).'
    ],
    cons: [
      'Violates Single Responsibility Principle.',
      'Can hide bad design (global state).',
      'Difficult to unit test due to global state.'
    ],
    codeExample: `class Singleton {
private:
    static Singleton* instance;
    Singleton() {}

public:
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    static Singleton* getInstance() {
        if (instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }

    void doSomething() {
        std::cout << "Singleton is working!\\n";
    }
};

Singleton* Singleton::instance = nullptr;`
  },
  {
    id: 'lazy-init',
    name: 'Lazy Initialization',
    category: PatternCategory.CREATIONAL,
    description: 'Delays the creation of an object until the first time it is needed.',
    whenToUse: [
      'When the object is expensive to create and might not be used at all.',
      'To reduce startup time.'
    ],
    pros: [
      'Improves application startup performance.',
      'Saves resources if objects are never used.'
    ],
    cons: [
      'Slight performance hit on first access.',
      'Potential thread-safety issues if not carefully implemented.'
    ],
    codeExample: `class ExpensiveObject {
public:
    ExpensiveObject() { /* Intense work */ }
    void Use() { std::cout << "Using object\\n"; }
};

class LazyWrapper {
private:
    std::unique_ptr<ExpensiveObject> instance;
public:
    ExpensiveObject* getInstance() {
        if (!instance) {
            instance = std::make_unique<ExpensiveObject>();
        }
        return instance.get();
    }
};`
  },
  {
    id: 'pimpl',
    name: 'Pimpl (Pointer to Impl)',
    category: PatternCategory.STRUCTURAL,
    description: 'Removes implementation details from a class header by placing them in a separate class, accessed via a pointer.',
    whenToUse: [
      'To reduce compilation times by breaking header dependencies.',
      'To provide a stable Binary Interface (ABI).'
    ],
    pros: [
      'Compilation firewall: private changes don\'t trigger client recompile.',
      'Improved encapsulation.'
    ],
    cons: [
      'Extra indirection slightly affects performance.',
      'Management of the implementation object lifetime.'
    ],
    codeExample: `// Widget.h
class Widget {
public:
    Widget();
    ~Widget();
    void DoSomething();
private:
    class Impl;
    std::unique_ptr<Impl> pImpl;
};

// Widget.cpp
class Widget::Impl {
public:
    void InternalMethod() { /* ... */ }
};

Widget::Widget() : pImpl(std::make_unique<Impl>()) {}
Widget::~Widget() = default;
void Widget::DoSomething() { pImpl->InternalMethod(); }`
  },
  {
    id: 'builder',
    name: 'Builder',
    category: PatternCategory.CREATIONAL,
    description: 'Lets you construct complex objects step by step.',
    whenToUse: [
      'To avoid "telescoping constructors" with many parameters.',
      'When you want to create different representations of some product.'
    ],
    pros: [
      'Construct objects step-by-step.',
      'Reuse construction code for various representations.'
    ],
    cons: [
      'Increased complexity due to multiple new classes.'
    ],
    codeExample: `class Product {
public:
    std::vector<std::string> parts_;
    void ListParts() const {
        for (const auto& p : parts_) std::cout << p << " ";
        std::cout << "\\n";
    }
};

class Builder {
public:
    virtual ~Builder() {}
    virtual void ProducePartA() const = 0;
    virtual void ProducePartB() const = 0;
};

class ConcreteBuilder1 : public Builder {
private:
    Product* product;
public:
    ConcreteBuilder1() { this->Reset(); }
    void Reset() { this->product = new Product(); }
    void ProducePartA() const override { this->product->parts_.push_back("PartA1"); }
    void ProducePartB() const override { this->product->parts_.push_back("PartB1"); }
    Product* GetProduct() { 
        Product* result = this->product;
        this->Reset();
        return result;
    }
};`
  },
  {
    id: 'adapter',
    name: 'Adapter',
    category: PatternCategory.STRUCTURAL,
    description: 'Allows objects with incompatible interfaces to collaborate.',
    whenToUse: [
      'When you want to use some existing class with an incompatible interface.'
    ],
    pros: [
      'Single Responsibility Principle: separate interface conversion from business logic.',
      'Open/Closed Principle: add new adapters easily.'
    ],
    cons: [
      'Overall code complexity increases.'
    ],
    codeExample: `class Target {
public:
    virtual ~Target() = default;
    virtual std::string Request() const { return "Target: Default behavior."; }
};

class Adaptee {
public:
    std::string SpecificRequest() const { return ".eetpadA eht fo roivaheb laicepS"; }
};

class Adapter : public Target {
private:
    Adaptee *adaptee_;
public:
    Adapter(Adaptee *adaptee) : adaptee_(adaptee) {}
    std::string Request() const override {
        std::string to_reverse = this->adaptee_->SpecificRequest();
        std::reverse(to_reverse.begin(), to_reverse.end());
        return "Adapter: (TRANSLATED) " + to_reverse;
    }
};`
  },
  {
    id: 'observer',
    name: 'Observer',
    category: PatternCategory.BEHAVIORAL,
    description: 'Defines a subscription mechanism to notify multiple objects about events.',
    whenToUse: [
      'When changes to one object require changing others.',
      'When an abstraction has two aspects, one dependent on the other.'
    ],
    pros: [
      'Runtime relationships between objects.',
      'Add new subscribers without changing the publisher.'
    ],
    cons: [
      'Subscribers are notified in random order.',
      'Risk of memory leaks if not detached.'
    ],
    codeExample: `class IObserver {
public:
    virtual ~IObserver() {}
    virtual void Update(const std::string &message) = 0;
};

class Subject {
public:
    void Attach(IObserver *obs) { observers.push_back(obs); }
    void Detach(IObserver *obs) { observers.remove(obs); }
    void Notify() {
        for (auto o : observers) o->Update(message);
    }
private:
    std::list<IObserver *> observers;
    std::string message;
};`
  }
];
