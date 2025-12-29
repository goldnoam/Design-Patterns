
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
        return "Result of ConcreteProductA1.";
    }
};

class ConcreteProductB1 : public AbstractProductB {
public:
    std::string UsefulFunctionB() const override {
        return "Result of ConcreteProductB1.";
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

int main() {
    std::cout << "Usage of Abstract Factory (Factory 1):\\n";
    ConcreteFactory1 factory;
    auto pA = factory.CreateProductA();
    auto pB = factory.CreateProductB();
    std::cout << pA->UsefulFunctionA() << std::endl;
    std::cout << pB->UsefulFunctionB() << std::endl;
    return 0;
}`
  },
  {
    id: 'bridge',
    name: 'Bridge',
    category: PatternCategory.STRUCTURAL,
    description: 'Decouples an abstraction from its implementation so that the two can vary independently.',
    whenToUse: [
      'When you want to avoid a permanent binding between an abstraction and its implementation.',
      'When both abstractions and their implementations should be extensible by subclassing.'
    ],
    pros: [
      'Separation of interface and implementation.',
      'Improved extensibility.',
      'Hiding implementation details from clients.'
    ],
    cons: [
      'Increased complexity.'
    ],
    codeExample: `class Device {
public:
    virtual ~Device() = default;
    virtual void setEnabled(bool enabled) = 0;
    virtual bool isEnabled() = 0;
};

class Radio : public Device {
    bool on = false;
public:
    void setEnabled(bool enabled) override { on = enabled; }
    bool isEnabled() override { return on; }
};

class RemoteControl {
protected:
    Device* device;
public:
    RemoteControl(Device* dev) : device(dev) {}
    void togglePower() {
        device->setEnabled(!device->isEnabled());
    }
};`
  },
  {
    id: 'decorator',
    name: 'Decorator',
    category: PatternCategory.STRUCTURAL,
    description: 'Allows behavior to be added to an individual object, dynamically, without affecting the behavior of other objects from the same class.',
    whenToUse: [
      'To add responsibilities to individual objects dynamically and transparently.',
      'When extension by subclassing is impractical.'
    ],
    pros: [
      'More flexibility than static inheritance.',
      'Avoids feature-laden classes high up in the hierarchy.'
    ],
    cons: [
      'Can result in many small objects that look alike.'
    ],
    codeExample: `class Coffee {
public:
    virtual ~Coffee() = default;
    virtual double cost() = 0;
};

class SimpleCoffee : public Coffee {
public:
    double cost() override { return 1.0; }
};

class CoffeeDecorator : public Coffee {
protected:
    Coffee* coffee;
public:
    CoffeeDecorator(Coffee* c) : coffee(c) {}
};

class MilkDecorator : public CoffeeDecorator {
public:
    MilkDecorator(Coffee* c) : CoffeeDecorator(c) {}
    double cost() override { return coffee->cost() + 0.5; }
};`
  },
  {
    id: 'strategy',
    name: 'Strategy',
    category: PatternCategory.BEHAVIORAL,
    description: 'Enables selecting an algorithm at runtime.',
    whenToUse: [
      'When many related classes differ only in their behavior.',
      'When you need different variants of an algorithm.'
    ],
    pros: [
      'Algorithms are interchangeable.',
      'Avoids conditional statements for selecting behavior.'
    ],
    cons: [
      'Clients must be aware of different strategies.'
    ],
    codeExample: `class Strategy {
public:
    virtual ~Strategy() = default;
    virtual void execute() = 0;
};

class ConcreteStrategyA : public Strategy {
public:
    void execute() override { std::cout << "Strategy A\\n"; }
};

class Context {
    Strategy* strategy;
public:
    void setStrategy(Strategy* s) { strategy = s; }
    void run() { strategy->execute(); }
};`
  },
  {
    id: 'raii',
    name: 'RAII',
    category: PatternCategory.STRUCTURAL,
    description: 'Resource Acquisition Is Initialization: manages resource lifetime through object scope.',
    whenToUse: ['Managing any resource with a strict lifecycle (memory, files, locks).'],
    pros: ['Exception safety.', 'No manual cleanup.'],
    cons: ['Requires proper copy/move semantics.'],
    codeExample: `class MutexLock {
    std::mutex& m;
public:
    MutexLock(std::mutex& mutex) : m(mutex) { m.lock(); }
    ~MutexLock() { m.unlock(); }
};`
  },
  {
    id: 'crtp',
    name: 'CRTP',
    category: PatternCategory.STRUCTURAL,
    description: 'Curiously Recurring Template Pattern: achieves static polymorphism.',
    whenToUse: ['Compile-time polymorphism to avoid vtable overhead.'],
    pros: ['Better performance than virtual functions.', 'Mix-in functionality.'],
    cons: ['Complex syntax.', 'Increased binary size.'],
    codeExample: `template <typename Derived>
class Base {
public:
    void interface() { static_cast<Derived*>(this)->impl(); }
};

class Derived : public Base<Derived> {
public:
    void impl() { std::cout << "Derived Impl\\n"; }
};`
  }
];
