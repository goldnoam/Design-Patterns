
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

// Client code
int main() {
    ConcreteFactory1 factory;
    auto pA = factory.CreateProductA();
    std::cout << pA->UsefulFunctionA() << std::endl;
    return 0;
}`
  },
  {
    id: 'raii',
    name: 'RAII',
    category: PatternCategory.STRUCTURAL,
    description: 'Resource Acquisition Is Initialization: A C++ programming technique which binds the life cycle of a resource to the lifetime of an object.',
    whenToUse: [
      'Managing memory (smart pointers).',
      'Managing file handles, sockets, or database connections.',
      'Managing mutex locks in multi-threaded environments.'
    ],
    pros: [
      'Exception safety: resources are released even if an exception is thrown.',
      'Prevents resource leaks (memory, file handles).',
      'Encapsulates resource management logic.'
    ],
    cons: [
      'Requires disciplined use of classes for all resource management.'
    ],
    codeExample: `#include <iostream>
#include <fstream>
#include <string>

class FileHandler {
    std::fstream file;
public:
    FileHandler(const std::string& filename) {
        file.open(filename, std::ios::out);
        std::cout << "Resource Acquired: File opened.\\n";
    }
    
    ~FileHandler() {
        if (file.is_open()) {
            file.close();
            std::cout << "Resource Released: File closed.\\n";
        }
    }
    
    void write(const std::string& text) {
        file << text;
    }
};

int main() {
    {
        FileHandler handler("test.txt");
        handler.write("Hello RAII!");
    } // handler goes out of scope here, file is closed automatically
    return 0;
}`
  },
  {
    id: 'crtp',
    name: 'CRTP',
    category: PatternCategory.STRUCTURAL,
    description: 'Curiously Recurring Template Pattern: A C++ idiom where a class derived from a class template uses itself as a template argument.',
    whenToUse: [
      'Static polymorphism (compile-time method dispatch).',
      'Adding common functionality to multiple classes without virtual function overhead.',
      'Implementing "mixins".'
    ],
    pros: [
      'No runtime overhead (no vtable).',
      'Compile-time checks.',
      'Optimizable by the compiler (inlining).'
    ],
    cons: [
      'Increases binary size due to template instantiation.',
      'More complex syntax and error messages.'
    ],
    codeExample: `#include <iostream>

template <typename Derived>
class Base {
public:
    void interface() {
        // Static dispatch to the derived class
        static_cast<Derived*>(this)->implementation();
    }
};

class Derived1 : public Base<Derived1> {
public:
    void implementation() {
        std::cout << "Derived1 Implementation\\n";
    }
};

class Derived2 : public Base<Derived2> {
public:
    void implementation() {
        std::cout << "Derived2 Implementation\\n";
    }
};

template <typename T>
void execute(Base<T>& obj) {
    obj.interface();
}

int main() {
    Derived1 d1;
    Derived2 d2;
    execute(d1);
    execute(d2);
    return 0;
}`
  },
  {
    id: 'object-pool',
    name: 'Object Pool',
    category: PatternCategory.CREATIONAL,
    description: 'Uses a set of initialized objects kept in a ready-to-use "pool" rather than destroying and re-creating them on demand.',
    whenToUse: [
      'When object creation is expensive (e.g., database connections).',
      'When there is a high frequency of creation and destruction of identical objects.',
      'In performance-critical loops.'
    ],
    pros: [
      'Significant performance boost for expensive objects.',
      'Predictable memory footprint.',
      'Reduces heap fragmentation.'
    ],
    cons: [
      'Pool itself occupies memory even when idle.',
      'Objects must be correctly reset before reuse.'
    ],
    codeExample: `#include <vector>
#include <memory>

class Resource {
public:
    void reset() { /* Clear state */ }
    void use() { /* Logic */ }
};

class ResourcePool {
    std::vector<std::unique_ptr<Resource>> pool;
public:
    std::unique_ptr<Resource> acquire() {
        if (pool.empty()) {
            return std::make_unique<Resource>();
        }
        auto res = std::move(pool.back());
        pool.pop_back();
        return res;
    }
    
    void release(std::unique_ptr<Resource> res) {
        res->reset();
        pool.push_back(std::move(res));
    }
};`
  },
  {
    id: 'null-object',
    name: 'Null Object',
    category: PatternCategory.BEHAVIORAL,
    description: 'Provides an object as a surrogate for the lack of an object of a given type.',
    whenToUse: [
      'To avoid repetitive "if (ptr != nullptr)" checks throughout the code.',
      'When you want to provide default "do nothing" behavior safely.'
    ],
    pros: [
      'Cleaner client code.',
      'Reduces risk of null pointer exceptions.',
      'Simplifies logic by treating nulls and real objects uniformly.'
    ],
    cons: [
      'Can hide errors that should have been handled as missing dependencies.'
    ],
    codeExample: `#include <iostream>
#include <memory>

class Logger {
public:
    virtual ~Logger() = default;
    virtual void log(const std::string& msg) = 0;
};

class ConsoleLogger : public Logger {
public:
    void log(const std::string& msg) override {
        std::cout << "Log: " << msg << "\\n";
    }
};

class NullLogger : public Logger {
public:
    void log(const std::string& msg) override {
        /* Do nothing */
    }
};

class Service {
    std::unique_ptr<Logger> logger;
public:
    Service(std::unique_ptr<Logger> l) : logger(std::move(l)) {}
    void run() {
        logger->log("Service is running"); // No null check needed
    }
};`
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    category: PatternCategory.CREATIONAL,
    description: 'Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.',
    whenToUse: [
      'When a class can\'t anticipate the class of objects it must create.',
      'When a class wants its subclasses to specify the objects it creates.'
    ],
    pros: [
      'Avoids tight coupling between creator and concrete products.',
      'Single Responsibility Principle.',
      'Open/Closed Principle.'
    ],
    cons: [
      'Can lead to many subclasses.'
    ],
    codeExample: `class Product {
public:
    virtual ~Product() {}
    virtual std::string Operation() const = 0;
};

class ConcreteProduct1 : public Product {
public:
    std::string Operation() const override { return "Result of ConcreteProduct1"; }
};

class Creator {
public:
    virtual ~Creator() {}
    virtual Product* FactoryMethod() const = 0;

    std::string SomeOperation() const {
        Product* product = this->FactoryMethod();
        std::string result = "Creator: " + product->Operation();
        delete product;
        return result;
    }
};

class ConcreteCreator1 : public Creator {
public:
    Product* FactoryMethod() const override { return new ConcreteProduct1(); }
};`
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
    id: 'prototype',
    name: 'Prototype',
    category: PatternCategory.CREATIONAL,
    description: 'Lets you copy existing objects without making your code dependent on their classes.',
    whenToUse: [
      'When your code shouldn\'t depend on the concrete classes of objects that you need to copy.',
      'To reduce the number of subclasses that only differ in their initial state.'
    ],
    pros: [
      'Clone objects without coupling to concrete classes.',
      'Avoid repeated initialization code.',
      'Produce complex objects more conveniently.'
    ],
    cons: [
      'Cloning complex objects with circular references is tricky.'
    ],
    codeExample: `class Prototype {
public:
    virtual ~Prototype() {}
    virtual Prototype* clone() const = 0;
    virtual void Method() = 0;
};

class ConcretePrototype : public Prototype {
private:
    float state;
public:
    ConcretePrototype(float s) : state(s) {}
    Prototype* clone() const override {
        return new ConcretePrototype(*this);
    }
    void Method() override {
        std::cout << "State: " << state << "\\n";
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
